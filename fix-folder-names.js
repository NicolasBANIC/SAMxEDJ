const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'js', 'realisations-data.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('=== Correction des noms de dossiers ===\n');

const corrections = [
    {
        wrong: "folder: 'Chantier aménagement extérieur Metz'",
        correct: "folder: 'Chantier aménagement extérieur\u00A0Metz'"
    },
    {
        wrong: "folder: 'Chantier création bac à fleur  jardin Eschau'",
        correct: "folder: 'Chantier création bac à fleur  jardin\u00A0Eschau'"
    }
];

corrections.forEach(({ wrong, correct }) => {
    if (content.includes(wrong)) {
        console.log(`✓ Correction: ${wrong} → ${correct}`);
        content = content.replace(wrong, correct);
    } else {
        console.log(`⚠ Pas trouvé: ${wrong}`);
    }
});

fs.writeFileSync(dataPath, content, 'utf8');
console.log('\n✓ Fichier mis à jour!');

const baseDir = path.join(__dirname, 'assets', 'medias-realisations');

console.log('\n=== Vérification ===\n');

const foldersToCheck = [
    'Chantier aménagement extérieur\u00A0Metz',
    'Chantier création bac à fleur  jardin\u00A0Eschau'
];

foldersToCheck.forEach(folderName => {
    const folderPath = path.join(baseDir, folderName);
    const exists = fs.existsSync(folderPath);
    console.log(`${exists ? '✓' : '✗'} ${folderName}: ${exists ? 'EXISTE' : 'INTROUVABLE'}`);
    
    if (exists) {
        const files = fs.readdirSync(folderPath);
        console.log(`  → ${files.length} fichiers trouvés`);
    }
});
