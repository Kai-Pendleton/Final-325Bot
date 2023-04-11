
class Course {

	categoryId;
	studentRoleId;
	veteranRoleId;


    constructor(name, meetLoc, meetTime, optionalChannels) {
        this.name = [name];
        this.meetLoc = meetLoc;
        this.meetTime = meetTime;
        this.optionalChannels = optionalChannels;
    }

    endCourse(client) {
    	console.log("Course " + this.name + " ended.");
    }

}

module.exports = Course;