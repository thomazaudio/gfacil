package database;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import security.AccountUserDetails;

public class CurrentTenantIdentifierResolverImpl implements CurrentTenantIdentifierResolver {
	  
	  @Override
	  public String resolveCurrentTenantIdentifier() {
	      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();                
	      String database = "shared";
	      
	      if(authentication != null &&  authentication.getPrincipal() instanceof AccountUserDetails){
	    	  AccountUserDetails user = (AccountUserDetails)authentication.getPrincipal();
	    	  database = user.getDataBase();
	    	  
	    	 
	      }
	      
	    
	      return database;
	  }

	  @Override
	  public boolean validateExistingCurrentSessions() {
	      return true;
	  }

	}