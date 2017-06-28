package config;
import org.springframework.stereotype.Repository;

import config.Config;
import model.GenericDAO;

@Repository
public class ConfigDAO extends GenericDAO<Config> {

	public ConfigDAO() {
		super(Config.class);
		// TODO Auto-generated constructor stub
	}
   
}
