export function queryExpansionPrompt(query: string) {
    return `
        Query: ${query.toLowerCase()}
        Convert this user query into two optimized formats for different search systems:  
        
        vectorFriendlyQuery: 
        - Use natural, descriptive language that captures semantic meaning
        - Focus on concepts, emotions, and context
        - Write as if describing the scene/concept to someone
        - Good for embedding similarity matching      

        fulltextFriendlyQuery:
        - Use specific keywords, exact terms, and phrases
        - Focus on searchable words that would appear in documents
        - Remove articles (a, an, the) and connecting words
        - Good for exact text matching     

        Example:
        Query: "how to fix authentication errors in react apps"
        vectorFriendlyQuery: "troubleshooting authentication problems react application development"
        fulltextFriendlyQuery: "authentication error react fix troubleshoot"

        RETURN ALL VALUES AS LOWERCASE
    `;
}
