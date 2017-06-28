package config;
import org.springframework.stereotype.Service;

import config.Config;
import model.GenericService;

@Service
public class ConfigService extends GenericService<Config>{

	public Config getConf(){
		
		return getById(1);
	}
	
}
