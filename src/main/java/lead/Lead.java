package lead;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonView;
import crud.CrudClass;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
public class Lead extends CrudClass {
	

	//Data da ultima atualização do Lead
	@Temporal(TemporalType.TIMESTAMP)
	@JsonView(util.Views.Public.class)
	private Date lastUpdate;
	
	@JsonView(util.Views.Public.class)
	private String nome;
	
	//Origem do Lead ex: a1, a2, f1, f2
	@JsonView(util.Views.Public.class)
	private String codOrigem;

	//Ações do usuário, ex: comentou, etc
	@JsonView(util.Views.Public.class)
	@Transient
	private String transientAction;

	//Ações do usuário, ex: comentou, etc
	@JsonView(util.Views.Public.class)
	@Column( length = 100000 )
	private String actions;

	//Id do contato na lista externa
	@JsonView(util.Views.Public.class)
	private Long contact_id;

	//id da lista na ferramenta externa
	@JsonView(util.Views.Public.class)
	private Long list_id;

	@JsonView(util.Views.Public.class)
	private String phone_number;

	//Etapa atual do lead
	@JsonView(util.Views.Public.class)
	private String custom_1;

	@JsonView(util.Views.Public.class)
	private String teste;

}
