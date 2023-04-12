const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { confirmButton } = require('../utils/confirmButton.js');
const Semester = require('../utils/Semester');
const Course = require('../utils/Course');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletecourse')
        .setDescription('Deletes a course from an existing semester.')
        .addStringOption(option => option.setName('course')
            .setDescription('The name of the course to be deleted.')
            .setRequired(true))
        .addStringOption(option => option.setName('semester')
            .setDescription('The name of the semester the course belongs to.')
            .setRequired(true)),
    async execute(interaction) {
        const courseName = interaction.options.getString('course');
        const semesterName = interaction.options.getString('semester');
        if (!await confirmButton(interaction, "Are you sure you want to delete this course?", "Deleting Course!")) {
			return;
		}
        const filePath = `data/semesters/${semesterName}.json`;

        if (!fs.existsSync(filePath)) {
            await interaction.followUp({ content: `The semester "${semesterName}" does not exist.`, ephemeral: true });
            return;
        }

        const semesterData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const courseIndex = semesterData.courseList.findIndex(c => c.name.includes(courseName));

        if (courseIndex === -1) {
            await interaction.followUp({ content: `The course "${courseName}" does not exist in semester "${semesterName}".`, ephemeral: true });
            return;
        }

        semesterData.courseList.splice(courseIndex, 1);

        fs.writeFileSync(filePath, JSON.stringify(semesterData, null, 2), 'utf8');

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Course Deleted')
            .setDescription(`The course "${courseName}" has been deleted from semester "${semesterName}".`);

        return interaction.followUp({ embeds: [embed] });
    },
};
