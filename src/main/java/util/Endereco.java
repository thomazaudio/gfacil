package util;
import javax.persistence.Entity;
import com.fasterxml.jackson.annotation.JsonView;
import crud.CrudClass;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Endereco  extends CrudClass{

	//Logradouro
	@JsonView(util.Views.Public.class)
	private String xLgr;

	@JsonView(util.Views.Public.class)
	private String nro;
	
	//Complemento
	@JsonView(util.Views.Public.class)
	private String xCpl;
	
	//Complemento
	@JsonView(util.Views.Public.class)
	private String xBairro;
	
	//Complemento
	@JsonView(util.Views.Public.class)
	private String xMun;
	
	@JsonView(util.Views.Public.class)
	private String cMun;
	
	@JsonView(util.Views.Public.class)
	private String codigoUf;
	
	//Complemento
	@JsonView(util.Views.Public.class)
	private String uf;
	
	//Complemento
	@JsonView(util.Views.Public.class)
	private String cep;
	
	//Complemento
	@JsonView(util.Views.Public.class)
	private String cPais;
	
	//Complemento
	@JsonView(util.Views.Public.class)
	private String xPais;
	
	//Complemento
	@JsonView(util.Views.Public.class)
	private String fone;
	
	
	
}
