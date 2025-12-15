---
title: "African Folktales Digital Archive and Classifier"
problem: "African oral literature and folktales are rapidly disappearing as elders pass away and younger generations move to urban areas. While some collections exist in print, they are scattered, difficult to access, and lack the metadata needed for computational analysis. Researchers and educators need a centralized, searchable digital archive with tools to classify and analyze these cultural treasures."
tools:
  - Python
  - Django
  - PostgreSQL
  - Elasticsearch
  - React
  - Natural Language Processing
  - spaCy
  - Tesseract OCR
  - AWS S3
role: "Full-stack developer and digital archivist. Designed the database schema, implemented OCR pipeline for digitizing print collections, developed the classification algorithms, built the web interface, and collaborated with cultural organizations to source and validate content."
outcome: "Created a comprehensive digital archive containing 2,500+ folktales from 15 African countries, developed an ML classifier achieving 92% accuracy in categorizing stories by type (origin myths, moral tales, trickster stories, etc.), built a public-facing website serving 5,000+ monthly users, and established partnerships with three universities and two cultural preservation organizations."
---

## Project Overview

The African Folktales Digital Archive is a comprehensive platform for preserving, accessing, and analyzing oral literature from across the African continent. It combines digital humanities methodologies with modern web technologies to make these cultural treasures accessible to researchers, educators, and the general public.

## Motivation

African folktales represent centuries of wisdom, moral instruction, and cultural identity passed down through oral tradition. However, these stories face existential threats:
- Elders who hold this knowledge are passing away
- Urbanization is disrupting traditional storytelling practices  
- Existing written collections are scattered and inaccessible
- Lack of digital tools for computational analysis

This project aims to preserve this invaluable heritage while making it accessible for education, research, and cultural appreciation.

## Key Features

### Comprehensive Digital Archive
- **2,500+ Stories**: Curated collection from across Africa
- **15 Countries**: Representative coverage of major regions and language groups
- **Multiple Languages**: Stories in original languages with English translations
- **Rich Metadata**: Cultural context, themes, character types, and moral lessons

### Advanced Search and Discovery
- **Full-text Search**: Elasticsearch-powered searching across all content
- **Faceted Filtering**: Filter by country, language, theme, character type, or moral lesson
- **Similar Stories**: Recommendation system finding related tales across cultures
- **Geographic Visualization**: Interactive map showing story origins

### Intelligent Classification
- **Automated Categorization**: ML classifier organizing stories by type
- **Theme Extraction**: NLP pipeline identifying key themes and motifs
- **Character Recognition**: Identifying trickster figures, heroes, spirits, and archetypes
- **Cultural Pattern Analysis**: Detecting cross-cultural similarities and differences

### Educational Tools
- **Lesson Plans**: Ready-to-use materials for educators
- **Audio Recordings**: Where available, traditional tellings preserved
- **Cultural Context**: Background information on traditions and customs
- **Discussion Guides**: Questions for classroom or community use

## Technical Implementation

### Digitization Pipeline
1. **Source Material Collection**: Partnership with libraries and cultural organizations
2. **OCR Processing**: Tesseract for scanning print collections
3. **Manual Verification**: Quality control by native speakers
4. **Metadata Enrichment**: Adding cultural and linguistic annotations
5. **Database Storage**: PostgreSQL with full-text search capabilities

### Classification System
```python
# Example: Story classification
from archive.classifier import FolktaleClassifier

classifier = FolktaleClassifier()
story_text = "Once upon a time, Anansi the spider..."

categories = classifier.predict(story_text)
# Output: {
#   'primary_type': 'trickster_tale',
#   'confidence': 0.89,
#   'themes': ['cleverness', 'greed', 'consequences'],
#   'character_types': ['trickster', 'victim'],
#   'moral_lesson': 'wisdom over strength'
# }
```

### Technology Stack
- **Backend**: Django REST Framework for API and admin interface
- **Database**: PostgreSQL for relational data, Elasticsearch for search
- **Frontend**: React with responsive design for mobile access
- **Storage**: AWS S3 for audio files and scanned images
- **ML Pipeline**: spaCy for NLP, scikit-learn for classification

## Classification Categories

The ML system categorizes stories into several types:

1. **Origin Myths**: Explaining creation and natural phenomena
2. **Trickster Tales**: Featuring clever characters like Anansi or Hare
3. **Moral Tales**: Stories teaching ethical lessons
4. **Historical Legends**: Based on real events or figures
5. **Animal Fables**: Using animals to teach human lessons
6. **Supernatural Stories**: Featuring spirits, magic, or otherworldly beings

## Impact and Usage

### Academic Research
- **Digital Humanities**: Supporting computational folklore studies
- **Comparative Literature**: Enabling cross-cultural analysis
- **Linguistics**: Providing corpus for language research
- **Anthropology**: Preserving cultural knowledge

### Education
- **K-12 Classrooms**: Used in 50+ schools across three countries
- **University Courses**: Integrated into literature and African studies curricula
- **Public Libraries**: Featured in community reading programs
- **Cultural Centers**: Supporting heritage education initiatives

### Cultural Preservation
- **Community Engagement**: Local storytellers contributing content
- **Intergenerational Connection**: Bridging elders and youth
- **Diaspora Access**: Connecting African diaspora with heritage
- **Language Revitalization**: Supporting efforts to preserve endangered languages

## Key Insights

### Cross-cultural Patterns
Analysis revealed fascinating patterns:
- Trickster figures appear in 85% of surveyed cultures
- Moral lessons about greed appear in 60% of stories
- Animal characters serve similar symbolic roles across regions
- Creation myths share structural similarities

### Computational Folklore
The project demonstrates how NLP and ML can:
- Identify narrative structures automatically
- Detect cultural motifs and archetypes
- Enable large-scale comparative analysis
- Preserve endangered oral traditions

## Challenges and Solutions

### Challenge 1: Language Diversity
**Solution**: Implemented multilingual support and partnered with translators and cultural experts for accuracy.

### Challenge 2: Oral to Written Conversion
**Solution**: Developed guidelines preserving oral storytelling characteristics while making text readable.

### Challenge 3: Cultural Sensitivity
**Solution**: Established an advisory board of cultural experts to guide content curation and presentation.

## Future Directions

Planned enhancements include:
- Audio recording collection from traditional storytellers
- Mobile app for offline access in low-connectivity areas
- Community contribution platform for user-submitted stories
- Expansion to 30+ countries and 50+ languages
- Virtual reality storytelling experiences
- Integration with school curricula across Africa

## Public Access

The archive is freely available to researchers, educators, and the public:
- **Website**: [folktales.adamu.tech](https://folktales.adamu.tech)
- **API**: Open API for computational research
- **Dataset**: Selected stories available as research corpus
- **Documentation**: Guides for researchers and educators

## Partnerships

This project succeeds through collaboration:
- Three universities contributing research and validation
- Two cultural preservation organizations providing content
- Five community storytelling groups sharing oral traditions
- International folklore societies offering expertise

---

*This project represents my commitment to using technology for cultural preservation and making African heritage accessible to global audiences. If you're interested in collaboration or have stories to contribute, please [get in touch](/contact/).*
