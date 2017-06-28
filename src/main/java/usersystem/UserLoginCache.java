package usersystem;

import java.util.HashMap;

public class UserLoginCache {
	
	public static HashMap<String,UserSystem> users =  new HashMap<String,UserSystem>();
	
	public static UserSystem get(String login){
		
		return users.get(login);
	}

}
