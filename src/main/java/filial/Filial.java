package filial;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.Setter;
import util.Endereco;


@Entity
@Getter @Setter
@Table(name = "filial")
public class Filial  {


	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonView(util.Views.Public.class)
	private long id;
	
	//quando = 1, a filial está bloqueada, não pode ser acesada
	@JsonView(util.Views.Public.class)
	private int bloqueada;

	@JsonView(util.Views.Public.class)
	private String fone;

	@JsonView(util.Views.Public.class)
	private int tipoDoc;

	//Usado pelo sistema
	@JsonView(util.Views.Public.class)
	private String nome;

	//Usado para documentos fiscais
	@JsonView(util.Views.Public.class)
	private String xNome;

	//Nome fantasia
	@JsonView(util.Views.Public.class)
	private String xFant;

	@JsonView(util.Views.Public.class)
	private String email;


	@JsonView(util.Views.Public.class)
	private String cpf;

	@JsonView(util.Views.Public.class)
	private String cnpj;
	
	//Path do certificado digital importado
	@JsonView(util.Views.Public.class)
	private String pathCertificado;
	
	//Nome original do certificado importado
	@JsonView(util.Views.Public.class)
	private String nomeCertificado;
	
	//Senha do certificado
	@JsonView(util.Views.Public.class)
	private String senhaCertificado;


	
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
	private String ie;

	//Inscrição estadual do destinatário
	@JsonView(util.Views.Public.class)
	private String iest;


	//Inscrição estadual do destinatário
	@JsonView(util.Views.Public.class)
	private String im;


	//Cnfigurações padrão para emissão de NFe
	@JsonView(util.Views.Public.class)
	private String nfeMod;

	@JsonView(util.Views.Public.class)
	private String serie;

	@JsonView(util.Views.Public.class)
	private String nnf;

	@JsonView(util.Views.Public.class)
	private String tpNF;

	@JsonView(util.Views.Public.class)
	private String tpImp;

	@JsonView(util.Views.Public.class)
	private String indPag;

	@JsonView(util.Views.Public.class)
	private String tpEmis;

	@JsonView(util.Views.Public.class)
    private String indPres;

	@JsonView(util.Views.Public.class)
	private String indFinal;
	
	@JsonView(util.Views.Public.class)
	private String natOp;





}
