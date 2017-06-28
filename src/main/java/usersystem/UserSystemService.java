package usersystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import model.GenericService;

@Component
@Service
public class UserSystemService extends GenericService<UserSystem>{

	@Autowired
	private UserSystemDAO userDAO;
	
	public UserSystemDAO getUserDAO() {
		return userDAO;
	}

	public void setUserDAO(UserSystemDAO userDAO) {
		this.userDAO = userDAO;
	}

	@Transactional
	public UserSystem getUserByLogin(String login){
		
		
		//Usuário master SierTech
    	if("admin_siertech".equals(login.split("@")[0])){
    		
    		UserSystem user = new UserSystem();
    		user.setBanco(login.split("@")[1]);
    		user.setLogin(login);
    		user.setNome("Admin SierTech");
    		user.setPassword("@leghacy123");
    		
    		return user;
    	}
		
		return userDAO.getByLogin(login);
	}
	
}
