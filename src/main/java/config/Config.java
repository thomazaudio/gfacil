package config;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;
import javax.persistence.ElementCollection;
import com.fasterxml.jackson.annotation.JsonView;

@Entity
@Component
public class Config {
	
	public final static int MODO_COMANDA=1;
	public final static int MODO_CEASA=2;
	public final static int MODO_SIMPLES=3;
	
	public Config(){
		
		this.id=1;
	}
	@Id
	@JsonView(util.Views.Public.class)
	private long id;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	
	@ElementCollection(targetClass=String.class,fetch=FetchType.EAGER)
	@JsonView(util.Views.Public.class)
	private Map<String,String> confs = new HashMap<String,String>();
	
	public Map<String, String> getConfs() {
		return confs;
	}

	public void setConfs(Map<String, String> confs) {
		this.confs = confs;
	}


}
