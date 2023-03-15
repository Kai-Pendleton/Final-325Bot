
class Course {

	categoryId;
	studentRoleId;
	veteranRoleId;
    optionalChannels = [];


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