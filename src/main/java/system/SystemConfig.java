package system;
import config.Config;
import config.ConfigService;
import util.SpringUtil;

public class SystemConfig {
	
	public static Config config;
	
	public  static Config getConfig(){
		
		if(config==null){
			
			
			config = ((ConfigService) SpringUtil.getBean("configService")).getById(1);
			
		}
		else{
			System.out.println("------Configura��o j� lida-----");
		}
		
	
		return config;
		
	}
}
