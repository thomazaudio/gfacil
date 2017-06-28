package security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import usersystem.UserLoginCache;
import usersystem.UserSystem;
import usersystem.UserSystemService;

@Component
public class UserDetailServiceImpl implements UserDetailsService {

    @Autowired
    private UserSystemService service;
    
    @Override
    public AccountUserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
    	
    	
    	//Dados referentes ao usuário da empresa
    	UserSystem account = service.getUserByLogin(login);
    
        if(account!=null){
        
        	UserLoginCache.users.put(login,account);
        } 
        
        if(account == null) {
     
            throw new UsernameNotFoundException("no user found with " + login);
        }
        return new AccountUserDetails(account);
    }
}
