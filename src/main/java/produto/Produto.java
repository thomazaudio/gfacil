package produto;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonView;
import crud.CrudClass;
import fornecedor.Fornecedor;
import lombok.Getter;
import lombok.Setter;
import nfe.GrupoImposto;

@Entity
@Table(name = "produto")
@Getter @Setter
public  class Produto extends CrudClass {

	public static final int TIPO_PRODUTO=0;
	public static final int TIPO_SERVICO=1;

	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="id_fornecedor",nullable=true)
	@JsonView(util.Views.Public.class)
	private Fornecedor fornecedor;

	@JsonView(util.Views.Public.class)
	private int naoImprimir;
	
	@JsonView(util.Views.Public.class)
	private String tag;

	@JsonView(util.Views.Public.class)
	private String nome;

	@JsonView(util.Views.Public.class)
	private String origemProduto;

	@JsonView(util.Views.Public.class)
	private String embalagem;

	@JsonView(util.Views.Public.class)
	private int tipo; 


	@JsonView(util.Views.Public.class)
	private String categoria;

	@JsonView(util.Views.Public.class)
	private int combinaOpcao;

	@JsonView(util.Views.Public.class)
	private String marca;


	//Quantidade minima para alertas
	@JsonView(util.Views.Public.class)
	private int minQuant;



	//Histórico de preços de compra do produto no formato "2016-04-05@35.90,2016-05-05@32.00"
	@JsonView(util.Views.Public.class)
	@Column(name = "historicoPrecoCompra", columnDefinition = "varchar(900) default ' '")
	private String historicoPrecoCompra;

	@JsonView(util.Views.Public.class)
	private double preco;

	@JsonView(util.Views.Public.class)
	private String codigoBarras;

	@JsonView(util.Views.Public.class)
	private String localizacaoEstoque;

	@JsonView(util.Views.Public.class)
	private String codigo;

	@JsonView(util.Views.Public.class)
	private int vendas;


	@JsonView(util.Views.Public.class)
	private int selecionaOpcao;


	//LOGISTICA REVERSA

	//Define se irá aplicar logistica reversa na venda de produto
	@JsonView(util.Views.Public.class)
	private boolean usarLR;

	//Item de retorno da LR, ex: Caixa Plástica Retornável, Caixa Papelão Retornavel
	@JsonView(util.Views.Public.class)
	private String descricaoItemLR;


	//CAMPOS DESTINADOS A TRIBUTAÇÃO


	//Grupo de imposto
	@ManyToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="id_grupo_imposto",nullable=true)
	@JsonView(util.Views.Public.class)
	private GrupoImposto grupoImposto;


	@JsonView(util.Views.Public.class)
	private String xProd;

	@JsonView(util.Views.Public.class)
	private String cProd;


	@JsonView(util.Views.Public.class)
	private double pesoLiquido;


	@JsonView(util.Views.Public.class)
	private double pesoBruto;


	//Informações adicionais para o produto
	@JsonView(util.Views.Public.class)
	private String infAdProduto;

	@JsonView(util.Views.Public.class)
	private String cean;

	@JsonView(util.Views.Public.class)
	private String ncm;

	@JsonView(util.Views.Public.class)
	private String extipi;

	//Unidade comercial
	@JsonView(util.Views.Public.class)
	private String uCom;

	//Valor unitário comercial
	@JsonView(util.Views.Public.class)
	private String vUnCom;

	//Unidade Tributada
	@JsonView(util.Views.Public.class)
	private String uTrib;

	@JsonView(util.Views.Public.class)
	private String vUnTrib;


	// Início ICMS

	//Código da situação tributária do icms
	@JsonView(util.Views.Public.class)
	private String icmsCST;

	@JsonView(util.Views.Public.class)
	private String icmsOrig;

	@JsonView(util.Views.Public.class)
	private String icmsModBC;

	@JsonView(util.Views.Public.class)
	private String imcsPICMS;

	@JsonView(util.Views.Public.class)
	private String imcsModBCST;

	@JsonView(util.Views.Public.class)
	private String imcsPMVAST;

	@JsonView(util.Views.Public.class)
	private String icmsPRedBCST;

	@JsonView(util.Views.Public.class)
	private String icmsPICMS;

	@JsonView(util.Views.Public.class)
	private String icmsPICMSST;

	@JsonView(util.Views.Public.class)
	private String icmsModBCST;

	@JsonView(util.Views.Public.class)
	private String icmsMotDesICMS;

	@JsonView(util.Views.Public.class)
	private String icmsPBCOp;

	@JsonView(util.Views.Public.class)
	private String icmsPRedBC;

	@JsonView(util.Views.Public.class)
	private String icmsUFST;

	@JsonView(util.Views.Public.class)
	private String icmsPCredSN;

	//FIm ICMS

	public Produto(long id){

		this.setId(id);
	}

	public Produto(){

		//Construtor padrão.

	}


	//Necessário para funcionamento de documento fiscal
	public void setNome(String nome){

		this.nome = nome;
		this.xProd = nome;
	}


	public void setvUnCom(String vUnCom) {
		this.vUnCom = vUnCom;

		if(vUnCom!=null)
			this.preco = Double.parseDouble(vUnCom);
	}



}
