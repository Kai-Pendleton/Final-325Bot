
class Course {

    constructor(name, meetLoc, meetTime) {
        this.name = name;
        this.meetLoc = meetLoc;
        this.meetTime = meetTime;
    }

    endCourse(client) {
    	console.log("Course " + this.name + " ended.");
    }

}

module.exports = Course;