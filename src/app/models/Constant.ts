
// import * as moment from "moment";
export class Constant{

    static EMPTY_STRINGS = [null, undefined, "", "N/A", "n/a", " ", "null"];
	static LOOKUP_HIDE = [5,6,8,10];
	static EVENT_HIDE = [7,8,10];
	static ENTITY_HIDE = [4,6, 7];

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