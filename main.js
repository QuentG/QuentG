const readme = require('./src/readme')
const fs = require('fs').promises;

const STACK_IDENTIFIER = '<@stack>';
const UPDATED_AT_IDENTIFIER = '<@updated_at>';
const UPDATED_BY_IDENTIFIER = '<@updated_by>';

const getIdentifiers = (_readme) => {
    // Identifier are all the <@...> in the readme
    return _readme.match(/<@([^>]*)>/g);
}

const generateFreshReadme = () => {
    let newReadme = structuredClone(readme);
    const identifiers = getIdentifiers(newReadme);

    // Get the identifiers and replace them with the content
    for (const identifier of identifiers) {
        const content = getContentByIdentifier(identifier);
        if (!content) {
            continue;
        }


        newReadme = newReadme.replace(identifier, content);
    }

    return newReadme;
}

const getContentByIdentifier = (identifier) => {
    switch (identifier) {
        case STACK_IDENTIFIER:
            return getMyStack();
        case UPDATED_AT_IDENTIFIER:
            return getFormattedDate();
        case UPDATED_BY_IDENTIFIER:
            return 'QuentBot 🤖';
        default:
            return null;
    }
}

const getMyStack = () => {
    return `\`\`\`json
{
  "frontend": {
    "js": ["React", "Next.js"],
    "css": ["Tailwind", "Shadcn/ui"]
  },
  "backend": {
    "php": ["Symfony"],
    "js": ["Nest.js"]
  },
  "mobile": ["React Native"],
  "database": ["MySQL", "PostgreSQL", "MongoDB"],
  "devOps": ["Docker", "Vercel", "Nginx"],
  "tools": ["Git", "Notion", "Jira", "Confluence"],
  "misc": ["TypeScript", "Firebase", "GraphQL", "REST API"]
}
\`\`\``;
}

const getFormattedDate = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${day}/${month}/${year}`;
}

const main = async () => {
    const newReadme = generateFreshReadme();
    await fs.writeFile('README.md', newReadme);
}

main()
    .then(() => console.log('README.md updated successfully !'))
    .catch(console.error);
