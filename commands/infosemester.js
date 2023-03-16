const { SlashCommandBuilder } = require('@discordjs/builders');
const { readdirSync, readFileSync } = require('fs');
const Semester = require('../utils/Semester.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infosemester')
        .setDescription('Reads all .json files under /data/semesters and prints the information to screen'),
    async execute(interaction) {
        const directoryPath = './data/semesters';

        const files = readdirSync(directoryPath);                                           //Read all files under the /data/semesters directory
                                       
        const jsonFiles = files.filter(file => file.endsWith('.json'));                     //Filter only the .json files

        await interaction.reply({
            content: 'Semester List'
        });

        for (const file of jsonFiles) {                                                     //Print the contents of each .json file
            const filePath = `${directoryPath}/${file}`;
            //const data = require('../' + filePath);
            let data = readFileSync(filePath, "utf-8");
            semesterObject = Object.assign(new Semester(), JSON.parse(data));

            console.log(data);
            await interaction.followUp({
                content: JSON.stringify(data).replace(/\\r/g, '\r').replace(/\\n/g, '\n')
            });
        }
    },
};

//let semesterObject;
//(fs.existsSync("data/semesters/" + semesterName + ".json")) {
//    let data = fs.readFileSync("data/semesters/" + semesterName + ".json", "utf-8");
//    semesterObject = Object.assign(new Semester(), JSON.parse(data));
//} 