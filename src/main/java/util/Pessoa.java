package util;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonView;
import crud.CrudClass;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="pessoa")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="tipo_pessoa", discriminatorType=DiscriminatorType.STRING)
@Getter @Setter
public class Pessoa extends CrudClass{


	public static final String TIPO_PESSOA_FISCAL_FISICA="1";
	public static final String TIPO_PESSOA_FISCAL_JURIDICA="2";
	public static final String TIPO_PESSOA_FISCAL_ESTRANGEIRA="3";

	@JsonView(util.Views.Public.class)
	private String observacoes;

	@JsonView(util.Views.Public.class)
	private String permissoes;

	@JsonView(util.Views.Public.class)
	@Column(unique=true)
	private String pin;

	@JsonView(util.Views.Public.class)
	@Column(unique=true)
	private String login;

	@JsonView(util.Views.Public.class)
	private String senha;

	//Identifica se a senha padrão não foi alterada (defaultPassword==1)
	@JsonView(util.Views.Public.class)
	private boolean defaultPassword;


	@JsonView(util.Views.Public.class)
	private String fone;

	@JsonView(util.Views.Public.class)
	private int tipoDoc;

	@JsonView(util.Views.Public.class)
	private String nome;

	@JsonView(util.Views.Public.class)
	private String xNome;
	
	@JsonView(util.Views.Public.class)
	private String email;

	//cliente, fornecedor, funcionario, etc
	@JsonView(util.Views.Public.class)
	@Column(insertable = false, updatable = false)
	private String tipo_pessoa;

	@JsonView(util.Views.Public.class)
	private String cpf;

	@JsonView(util.Views.Public.class)
	private String cnpj;

	//Pessoa física, jurídica ou estrangeira
	@JsonView(util.Views.Public.class)
	private String tipoPessoaFiscal;


	@ManyToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="id_endereco",nullable=true)
	@JsonView(util.Views.Public.class)
	private Endereco endereco;

	//DADOS FISCAIS

	//Identificado da IE do destinatário
	@JsonView(util.Views.Public.class)
	private String indIEDest;

	//Inscrição estadual do destinatário
	@JsonView(util.Views.Public.class)
	private String IE;


	//Inscrição SUFRAMA
	@JsonView(util.Views.Public.class)
	private String ISUF;


	//Inscrição Municipal do tomador de serviço
	@JsonView(util.Views.Public.class)
	private String IM;







}
