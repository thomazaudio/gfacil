package nfe;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Transient;
import com.fasterxml.jackson.annotation.JsonView;
import br.inf.portalfiscal.nfe.schema.envinfe.TNFe.InfNFe;
import crud.CrudClass;
import lombok.Getter;
import lombok.Setter;
import movimentacao.Movimentacao;

//IMPORTANTE!!
//Esta classe é relacionada a representação da NFe no banco de dados

@Getter @Setter
@Entity
public class NFe extends CrudClass {

    
	//Status da NFe
	public static int STATUS_CRIADA=1;
	public static int STATUS_VALIDADA=2;
	public static int STATUS_ASSINADA=3;
	public static int STATUS_ENVIADA=4;
	public static int STATUS_AUTORIZADA=5;
	public static int STATUS_REJEITADA=6;
	public static int STATUS_DENEGADA = 7;
	public static int STATUS_CANCELADA=8;
	public static int STATUS_INUTILIZADA = 9;

	

	//Chave de acesso
	@JsonView(util.Views.Public.class)
	@Column(unique=true)
	private String chaveNFE;

	//Data de emissão da nota
	@JsonView(util.Views.Public.class)
	private Date dataEmissao;

	//Status (autorizada,cancelada, etc)
	@JsonView(util.Views.Public.class)
	private int status;

	//Número do ultimo recebido de processamento da NFE
	@JsonView(util.Views.Public.class)
	private String numeroRececiboProc;

	//Modelo da nota (Ex: 55)
	@JsonView(util.Views.Public.class)
	private String modelo;

	@JsonView(util.Views.Public.class)
	private String naturezaOperacao;


	//Protocolo de transação 
	@JsonView(util.Views.Public.class)
	private String numeroProtocolo;

	//Movimentação relacionada a NFe
	@OneToOne
	@JsonView(util.Views.Public.class)
	private Movimentacao movimentacao;

	
	//Versão do XML
	@JsonView(util.Views.Public.class)
	private String versao;
	
	//CFOP principal da NFe
	@JsonView(util.Views.Public.class)
	private String cfopPadrao;

	//Erros de validação das informaçoes da NFe ex: "CNPJ inválido, CEP inválido, Inscrição estadual inválida"
	//Versão do XML
	//Os valores são separados por vírgula e são setados em tempo de execução (a cada pedido de validação)
	@Transient
	@JsonView(util.Views.Public.class)
	private String errosValidacao;
	
	
	//Representa o xml correspondente ao lote de envio da NFe (Caso a NFe tenha sido gerada pelo sistema)
	//Representa o xml de layout de distribuição da NFe (Caso a NFe armazenada não tenha sido gerada pelo sistema, ex: Manifesto de NFe)
	@Column(name = "xmlNFe",length=900000)
	private String xmlNFe;
	
	
	//CPF ou CNPJ do destinatário
	@JsonView(util.Views.Public.class)
	private String docDest;
	
	//CPF ou CNPJ do emitente
	@JsonView(util.Views.Public.class)
	private String docEmit;
	
	
	//Utilizado apenas para transportar das informações da NFe
	//Contém as informações referentes a NFe
	//É setado somente quando é necessário recuperar todos os detalhes de uma NFe (getById)
	@Transient
	@JsonView(util.Views.Public.class)
	private InfNFe infNFe;
	
	
	
	
	




}
