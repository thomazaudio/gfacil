package lead;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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


	//Salvo utilizando o formulário de cadasor
	@JsonView(util.Views.Public.class)
	@Transient
	private String savedInForm;

	//Data da ultima atualização do Lead
	@Temporal(TemporalType.TIMESTAMP)
	@JsonView(util.Views.Public.class)
	private Date lastUpdate;

	@JsonView(util.Views.Public.class)
	private String nome;

	//Data da ultima atualização do Lead
	@Temporal(TemporalType.TIMESTAMP)
	@JsonView(util.Views.Public.class)
	private Date dataUltimoLogin;

	//Data da ultima atualização do Lead
	@Temporal(TemporalType.TIMESTAMP)
	@JsonView(util.Views.Public.class)
	private Date dataUltimaEtapa;

	//Data da ultima atualização do Lead
	@Temporal(TemporalType.TIMESTAMP)
	@JsonView(util.Views.Public.class)
	private Date dataUltimoCadastro;

	@JsonView(util.Views.Public.class)
	private String etapaFunil;

	//Origem do Lead ex: a1, a2, f1, f2, s1, s2, s3
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
	private String telefone;

	@JsonView(util.Views.Public.class)
	private String custom_1;

	//Ultima ação do usuário
	@JsonView(util.Views.Public.class)
	private String lastAction;

	@JsonView(util.Views.Public.class)
	private String alturaTela;

	@JsonView(util.Views.Public.class)
	private String larguraTela;

	@JsonView(util.Views.Public.class)
	private String email;


	//Versão da landing page utilizada no processo
	@JsonView(util.Views.Public.class)
	private String versaoLandingPage;

	//Bowser do dispositivo
	@JsonView(util.Views.Public.class)
	private String device= "";

	//Sistema operacional do dispositivo
	@JsonView(util.Views.Public.class)
	private String os= "";

	//Bowser do dispositivo
	@JsonView(util.Views.Public.class)
	private String browser= "";

	@JsonView(util.Views.Public.class)
	private String teste;

	@JsonView(util.Views.Public.class)
	private String comentarios;


	//Métricas do lead
	@ElementCollection(targetClass=Integer.class,fetch=FetchType.EAGER)
	@JsonView(util.Views.Public.class)
	private Map<String, Integer> metrics = new HashMap<String,Integer>();

	//Questões do lead
	@ElementCollection(targetClass=String.class,fetch=FetchType.EAGER)
	@JsonView(util.Views.Public.class)
	private Map<String, String> questions = new HashMap<String,String>();

}
