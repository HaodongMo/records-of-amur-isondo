import profanityData from '../assets/profanity_en.json'

interface ProfanityEntry {
  id: string
  match: string
}

interface ProfanityCategory {
  notes: string
  severity: number
  tags: string[]
  dictionary: ProfanityEntry[]
}

type ProfanityDatabase = ProfanityCategory[]

class ContentFilter {
  private filterData: ProfanityDatabase = profanityData

  /**
   * Filter content based on maximum allowed severity level
   * @param text - Text to filter
   * @param maxSeverity - Maximum allowed severity (1-4, where 4 is most severe)
   * @returns Filtered text with inappropriate words censored
   */
  filterContent(text: string, maxSeverity: number = 2): string {
    let filteredText = text

    // Get all categories that exceed the max severity
    const categoriesToFilter = this.filterData.filter(category =>
      category.severity > maxSeverity
    )

    // Apply filtering for each category
    categoriesToFilter.forEach(category => {
      category.dictionary.forEach(entry => {
        // Split the match patterns by | and create regex for each
        const patterns = entry.match.split('|')
        patterns.forEach(pattern => {
          const regex = new RegExp(`\\b${this.escapeRegex(pattern.trim())}\\b`, 'gi')
          filteredText = filteredText.replace(regex, '[censored]')
        })
      })
    })

    return filteredText
  }

  /**
   * Check if text contains inappropriate content
   * @param text - Text to check
   * @param maxSeverity - Maximum allowed severity
   * @returns True if text contains inappropriate content
   */
  containsInappropriateContent(text: string, maxSeverity: number = 2): boolean {
    const categoriesToCheck = this.filterData.filter(category =>
      category.severity > maxSeverity
    )

    return categoriesToCheck.some(category =>
      category.dictionary.some(entry => {
        const patterns = entry.match.split('|')
        return patterns.some(pattern => {
          const regex = new RegExp(`\\b${this.escapeRegex(pattern.trim())}\\b`, 'i')
          return regex.test(text)
        })
      })
    )
  }

  /**
   * Get severity level of text content
   * @param text - Text to analyze
   * @returns Highest severity level found in text (0 if clean)
   */
  getContentSeverity(text: string): number {
    let highestSeverity = 0

    this.filterData.forEach(category => {
      const hasMatch = category.dictionary.some(entry => {
        const patterns = entry.match.split('|')
        return patterns.some(pattern => {
          const regex = new RegExp(`\\b${this.escapeRegex(pattern.trim())}\\b`, 'i')
          return regex.test(text)
        })
      })

      if (hasMatch && category.severity > highestSeverity) {
        highestSeverity = category.severity
      }
    })

    return highestSeverity
  }

  /**
   * Get content rating based on severity
   * @param text - Text to analyze
   * @returns Content rating string
   */
  getContentRating(text: string): 'G' | 'PG' | 'PG-13' | 'R' | 'X' {
    const severity = this.getContentSeverity(text)

    switch (severity) {
      case 0:
      case 1:
        return 'G'
      case 2:
        return 'PG-13'
      case 3:
        return 'R'
      case 4:
      default:
        return 'X'
    }
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
}

export const contentFilter = new ContentFilter()
export type { ProfanityDatabase, ProfanityCategory, ProfanityEntry }