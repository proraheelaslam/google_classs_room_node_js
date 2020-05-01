const Joi = require('@hapi/joi');
const constants = require('../utils/constants');

const { successResponse, errorResponse, validationResponse, notFoundResponse } = require('../utils/apiResponse');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/classroom.courses'];
const googleApiCredential  = require('../config/credentials');
//


/**
 *
 * @param accessToken
 * @returns {OAuth2Client | *}
 */
const getGoogleAuth = (accessToken) => {

        const {client_secret, client_id, redirect_uris} = googleApiCredential.web;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        oAuth2Client.setCredentials(accessToken);
        return oAuth2Client;

};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const authGoogleClassRoom = async (req,res)=> {

    try {
        let token  = req.body.access_token;

        let accessToken = {
            "refresh_token": token
        };
        let googleAuth = getGoogleAuth(accessToken);
        let allCourses = await listCourses(googleAuth);

        if (allCourses && Object.keys(allCourses).length > 0) {
            return  res.send(successResponse('Course has been list' , allCourses));
        }else {
            res.send(notFoundResponse('Course not found!'));
        }
    }catch (e) {
        return res.send(e);
    }

};

/**
 *
 * @param auth
 * @returns {Promise<*>}
 */
async function listCourses(auth) {

    const classroom = google.classroom({version: 'v1', auth});
    let courseResponse = await classroom.courses.list({pageSize: 10,});
    return courseResponse.data;
}


async function addCourse(auth) {

    let course =   {

        "name": "BSC",
        "section": "B",
        "descriptionHeading": "BSC A",
        "room": "1",
        "ownerId": "100401368883098035330",
        "creationTime": "2020-04-29T14:44:46.418Z",
        "updateTime": "2020-04-29T14:44:45.063Z",
        "enrollmentCode": "4j4yorr",
        "courseState": "ACTIVE",
        "alternateLink": "https://classroom.google.com/c/OTg2NzY1Nzg5NTha",
        "teacherGroupEmail": "FSC_A_teachers_512b2bb5@classroom.google.com",
        "courseGroupEmail": "FSC_A_a9620355@classroom.google.com",
        "teacherFolder": {
            "id": "0BwcqXmFPeqU4fjdvZ1dVNmVZM0dWNVdZcS1oYkZGeGd3ZFdnRW1pV0ZmemJ0MGRNSGVFU2c",
            "title": "FSC A",
            "alternateLink": "https://drive.google.com/drive/folders/0BwcqXmFPeqU4fjdvZ1dVNmVZM0dWNVdZcS1oYkZGeGd3ZFdnRW1pV0ZmemJ0MGRNSGVFU2c"
        },
        "guardiansEnabled": false,
        "calendarId": "classroom100296212298835901413@group.calendar.google.com"
    };
    const classroom = google.classroom({version: 'v1', auth});
    const courses = await classroom.courses.create(course);
    console.log(courses);
    let courseResponse = await classroom.courses.list({pageSize: 10,});
    return courseResponse.data;
}




let classRoom = {};
classRoom.authGoogleClassRoom = authGoogleClassRoom;
classRoom.addCourse = addCourse;


module.exports  = classRoom;