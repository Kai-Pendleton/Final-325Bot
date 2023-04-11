const { SlashCommandBuilder } = require('@discordjs/builders');
const { readdirSync, readFileSync, rmSync } = require('fs');
const Reaction = require('../utils/Reaction.js');
const { confirmButton } = require('../utils/confirmButton.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purgereactions')
		.setDescription('Deletes all content in the data reaction folder.'),

async execute(interaction, client) {

    if (!await confirmButton(interaction, "Are you sure you want to delete reaction data?", "Deleting data...")) {
        return;
    }
    const directoryPath = './data/reaction';

    const files = readdirSync(directoryPath); //Read all files under the /data/semesters directory
                                       
    const jsonFiles = files.filter(file => file.endsWith('.json')); //Filter only the .json files
    console.log(jsonFiles);

    for (const file of jsonFiles) {
        const filePath = `${directoryPath}/${file}`;
        console.log(filePath);
        rmSync(filePath);
    }
    await interaction.followUp('Deleted');
}}