const fs = require('fs');
const Course = require('../utils/Course.js');

class Semester {

    constructor(name) {
        this.name = name;
        this.courseList = [];
    }

    addCourse(course) {
        this.courseList.push(course);
        this.updateFile();
        console.log(course.name + " was added to " + this.name);
    }

    endSemester(client) {
        for (course in courseList) {
            course.endCourse(client);
            console.log("Semester " + this.name + " ended.");
        }
    }

    updateFile() {
        fs.writeFileSync("data/semesters/" + this.name + ".json", JSON.stringify(this, null, 2),"utf-8");
    }

}

module.exports = Semester;