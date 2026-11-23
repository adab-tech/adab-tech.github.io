"""Generate the public Word and PDF downloads from the editable site CV."""
import argparse
import json
import re
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlsplit

from docx import Document
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.opc.constants import RELATIONSHIP_TYPE as RT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

ROOT = Path(__file__).resolve().parents[1]
BASENAME = "Adamu-Danjuma-Abubakar-CV"
PUBLIC_SITE = "https://adamu.tech"
INLINE = re.compile(r"(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))")


def public_url(value):
    if not value or re.search(r"[\s\\\x00-\x1f\x7f]", value):
        return None
    if value.startswith("/") and not value.startswith("//"):
        return urljoin(PUBLIC_SITE, value)
    if value.startswith("#"):
        return urljoin(PUBLIC_SITE + "/cv/", value)
    if re.fullmatch(r"mailto:[^@\s?]+@[\w.-]+\.[a-zA-Z]{2,}(?:\?[^\s]*)?", value, re.I):
        return value
    try:
        url = urlsplit(value)
        if url.scheme == "https" and url.hostname and not (url.username or url.password):
            return value
    except ValueError:
        pass
    return None


def add_link(paragraph, label, target):
    url = public_url(target)
    if not url:
        paragraph.add_run(label)
        return
    link = OxmlElement("w:hyperlink")
    link.set(qn("r:id"), paragraph.part.relate_to(url, RT.HYPERLINK, is_external=True))
    run = paragraph.add_run(label)
    run.underline = True
    run.font.color.rgb = RGBColor.from_string("174C56")
    link.append(run._r)
    paragraph._p.append(link)


def add_inline(paragraph, text):
    # Match the same four inline constructs that the site's InlineText supports.
    for token in INLINE.split(text):
        if token.startswith("**") and token.endswith("**") and len(token) > 4:
            paragraph.add_run(token[2:-2]).bold = True
        elif token.startswith("*") and token.endswith("*") and len(token) > 2:
            paragraph.add_run(token[1:-1]).italic = True
        elif token.startswith("`") and token.endswith("`") and len(token) > 2:
            paragraph.add_run(token[1:-1])
        elif match := re.fullmatch(r"\[([^\]]+)\]\(([^)\s]+)\)", token):
            add_link(paragraph, *match.groups())
        elif token:
            paragraph.add_run(token)


def prepare_document(cv):
    doc = Document()
    doc.core_properties.title = cv["name"] + " | Curriculum Vitae"
    doc.core_properties.author = cv["name"]
    doc.core_properties.subject = cv["headline"]
    doc.core_properties.comments = ""
    doc.core_properties.created = doc.core_properties.modified = datetime.now(timezone.utc)
    page = doc.sections[0]
    page.page_width, page.page_height = Inches(8.5), Inches(11)
    page.left_margin = page.right_margin = Inches(0.76)
    page.top_margin = page.bottom_margin = Inches(0.65)
    page.footer_distance = Inches(0.29)

    body = doc.styles["Normal"]
    body.font.name = "Arial"
    body.font.size = Pt(11)
    body.font.color.rgb = RGBColor.from_string("222222")
    body.paragraph_format.line_spacing = 1.06
    body.paragraph_format.space_after = Pt(3)
    for name, size, bold, before, after in [
        ("Title", 25, True, 0, 4),
        ("Heading 1", 15, True, 8, 3),
        ("Heading 2", 11, True, 4, 2),
        ("CV detail", 10.5, False, 0, 3),
        ("CV bullet", 11, False, 0, 3),
    ]:
        style = doc.styles[name] if name in doc.styles else doc.styles.add_style(name, WD_STYLE_TYPE.PARAGRAPH)
        style.base_style = body
        style.font.name = "Arial"
        # Built-in heading styles otherwise prefer Word's theme font over Arial.
        fonts = style.element.get_or_add_rPr().rFonts
        for attribute in ("asciiTheme", "hAnsiTheme", "eastAsiaTheme", "cstheme"):
            fonts.attrib.pop(qn("w:" + attribute), None)
        style.font.size = Pt(size)
        style.font.color.rgb = RGBColor.from_string("203947")
        style.font.bold = bold
        style.font.italic = False
        style.paragraph_format.keep_with_next = bold
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)

    bullet = doc.styles["CV bullet"].paragraph_format
    bullet.left_indent = Inches(0.18)
    bullet.first_line_indent = Inches(-0.18)

    footer = page.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    footer.style = "CV detail"
    footer.add_run(cv["name"] + "   ·   ")
    page_number = OxmlElement("w:fldSimple")
    page_number.set(qn("w:instr"), "PAGE")
    footer._p.append(page_number)
    return doc


def create_cv(cv):
    doc = prepare_document(cv)
    headings = cv.get("sectionHeadings") or {}

    def body(text, style="Normal"):
        if text:
            paragraph = doc.add_paragraph(style=style)
            add_inline(paragraph, text)
            return paragraph

    def heading(name, default):
        doc.add_heading(headings.get(name) or default, 1)

    def entry(title, date=""):
        doc.add_heading("  |  ".join(filter(None, [title, date])), 2)

    def links(items):
        items = [(label, url) for label, url in items if label]
        if items:
            paragraph = doc.add_paragraph(style="CV detail")
            for index, (label, url) in enumerate(items):
                if index:
                    paragraph.add_run("  ·  ")
                add_link(paragraph, label, url)

    doc.add_paragraph(cv["name"], "Title")
    body(cv["headline"])
    body(cv["location"], "CV detail")
    contact = [(cv["website"], cv.get("websiteUrl")), (cv["email"], "mailto:" + cv["email"])]
    contact.extend((p["label"], p["url"]) for p in cv["profiles"])
    links(contact)
    body(cv.get("summary"))

    if cv["education"]:
        heading("education", "Education")
        for item in cv["education"]:
            p = doc.add_paragraph()
            p.add_run(item["degree"]).bold = True
            p.add_run("  |  " + item["date"] + ". " + item["institution"])

    if cv["datasets"]:
        heading("datasets", "Digital scholarship and research projects")
        for item in cv["datasets"]:
            entry(item["title"], item["year"])
            body(item["meta"], "CV detail")
            body(item["description"])
            links((link["label"], link["url"]) for link in item["links"])

    if cv["experience"]:
        heading("experience", "Experience")
        for item in cv["experience"]:
            entry(item["title"], item["dates"])
            summary = body(item["summary"])
            if summary and item["bullets"]:
                summary.paragraph_format.keep_with_next = True
            for bullet in item["bullets"]:
                body("•  " + bullet, "CV bullet")

    if cv["publicationGroups"]:
        heading("publications", "Publications")
        for group in cv["publicationGroups"]:
            doc.add_heading(group["heading"], 2)
            for item in group["items"]:
                p = doc.add_paragraph()
                add_link(p, item["title"], item["href"])
                if item["venue"]:
                    p.add_run("  ·  " + item["venue"])
        if cv.get("scholarUrl") and all(p["url"] != cv["scholarUrl"] for p in cv["profiles"]):
            links([(cv.get("scholarLabel") or "Google Scholar", cv["scholarUrl"])])

    if cv["languages"]:
        heading("languages", "Languages")
        p = doc.add_paragraph()
        for index, item in enumerate(cv["languages"]):
            if index:
                p.add_run("  ·  ")
            p.add_run(item["name"]).bold = True
            p.add_run(" — " + item["level"])
            if item["note"]:
                p.add_run(" (" + item["note"] + ")")

    return doc


def export(output):
    cv = json.loads((ROOT / "content/site/cv.json").read_text(encoding="utf-8"))
    output.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=output) as temporary:
        directory = Path(temporary).resolve()
        docx = directory / (BASENAME + ".docx")
        create_cv(cv).save(docx)
        subprocess.run([
            "soffice", "-env:UserInstallation=" + (directory / "profile").as_uri(),
            "--headless", "--convert-to", "pdf", "--outdir", str(directory), str(docx),
        ], check=True, timeout=120)
        pdf = docx.with_suffix(".pdf")
        # LibreOffice also returns success for some conversion errors.
        if not pdf.is_file() or not pdf.stat().st_size:
            raise RuntimeError("LibreOffice did not generate a PDF")
        for file in (docx, pdf):
            file.replace(output / file.name)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=ROOT / "public/downloads")
    export(parser.parse_args().output_dir)
