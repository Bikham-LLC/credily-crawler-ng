
// import * as moment from "moment";
export class Constant{

    static EMPTY_STRINGS = [null, undefined, "", "N/A", "n/a", " ", "null"];
	static LOOKUP_HIDE = [5, 6, 8, 10, 17, 19, 22, 23, 24, 25, 34, 36, 41];
	static EVENT_HIDE = [7, 8, 10, 18, 19, 22, 23, 24, 25, 27, 29, 30, 32, 33, 34, 35, 36, 40, 41, 42, 43, 48, 49];
	static ENTITY_HIDE = [4, 6, 8, 18, 19, 23, 24, 25, 29, 30, 32, 33, 34, 35, 36, 40, 41, 42, 43, 48, 49];
	static PATTERN_SHOW = [5, 20, 28, 32, 38];
	static REFRESH_HIDE = ['IN QUEUE','IN PROCESS','AWAIT QUEUE']
	static CRAWLER_TYPE_LICENSE_LOOKUP = 'License Lookup';
	static CRAWLER_TYPE_BOARD_CERTIFICATION = 'Board Certification';
	static CRAWLER_TYPE_COMMON_LINKS = 'Common';
	static APPLICATION_FOLLOW_UP = 'Application Follow-up';
	static RPA = 'RPA';

    /**
	 * Authentication constants
	 */
	static AUTHORIZATION = "Authorization"
	static BEARER = "Bearer"
	static TOKEN = "idToken"
	static REFRESH_TOKEN = "refreshToken"
	static ACCOUNT_UUID = "accountUuid"
	static USER_NAME = "userName"
	static USER_EMAIL = "userEmail"


}