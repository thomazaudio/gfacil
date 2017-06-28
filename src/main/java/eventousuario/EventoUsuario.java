package eventousuario;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.annotation.JsonView;

import crud.CrudClass;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@JsonRootName(value = "")
public class EventoUsuario extends CrudClass {
	
	
	@JsonView(util.Views.Public.class)
	private String login;
	
	@JsonView(util.Views.Public.class)
	private String evento;
	
	@JsonView(util.Views.Public.class)
	private String url;
	
	@Column(name = "descricao",length=900000)
	@JsonView(util.Views.Public.class)
	private String descricao;
	
	@JsonView(util.Views.Public.class)
	private Date hora = new Date();
	
	//Path onde ocorreu o evento (Ex: #/pdv)
	@JsonView(util.Views.Public.class)
	private String pathOrigem;
	
	//GET ou POST
	@JsonView(util.Views.Public.class)
	private String urlMethod;
	
	


}
