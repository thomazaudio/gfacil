package movimentacao;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import com.fasterxml.jackson.annotation.JsonView;
import crud.CrudClass;
import lombok.Getter;
import lombok.Setter;
import pedido.Pedido;
import util.DataUtil;
import util.Pessoa;

@Entity
@Getter @Setter
public class Movimentacao extends CrudClass{

	public static final int TIPO_DESPESA=1;
	public static final int TIPO_RECEITA=2;

	public static final int TIPO_REPETICAO_DIARIA=1;
	public static final int TIPO_REPETICAO_SEMANAL=2;
	public static final int TIPO_REPETICAO_MENSAl=3;

	//Tipos de operação possíveis para lançamento de movimentações
	public static final int TIPO_OPERACAO_AVULSA=0;
	public static final int TIPO_OPERACAO_VENDA =1;
	public static final int TIPO_OPERACAO_ENTRADA_ESTOQUE=2;


	/*

	 Uma movimentação possui 3 datas que são:
	 dataCadastrado (Herdado de crudClass): corresponde a data em que ocorreu o lançamento da entidade no banco de dados
	 dataBaixa: data em que ocorreu o pagamento da movimentação
	 data: corresponde a data de vencimento da movimentação

	 */


	/*

	 Obs: Uma movimentação é fixa quando modoRepeticao!=0
	 modoRepeticao indica o tipo de repeticão, ex: Diário, semanal, mensal

	 */

	public Movimentacao(){

	}

	public Movimentacao(long id){

		this.setId(id);
	}

	public Movimentacao(String descricao,String categoria,String dataVencimento,boolean fixa,int quantidade,int tipo,String formaPagamento, double valor){

		this.setData(dataVencimento);
		this.setDescricao(descricao);
		this.setCategoria(categoria);
		this.setTipo(tipo);

	}


	


	//Tipo de operação que lançou a movimentação (Vendas, entrada de marcadoria, cadastro avuslo, etc)
	@JsonView(util.Views.Public.class)
	private int tipoOperacaoLancamento;


	/*
	  Em movimentações recorrentes, indica para quais datas a movimentação já foi baixada,
	  ex: Movimentação recorrente com repetição MENSAL, data (vencimento) = 01/01/2001 baixas = "2001-01@2001-02".
	 */
	@JsonView(util.Views.Public.class)
	private String baixas;
	
	/*
	 Utilizado para categorização das movimentações, ex: "Gastos com transporte"
	*/
	@JsonView(util.Views.Public.class)
	private String categoria;

	/*
	 Descrição mais detalhada da movimentação, ex: "Pagamento de frete referente ao transpode de BV para BH"
	 */
	@JsonView(util.Views.Public.class)
	private String descricao;

	//Forma de pagamento: ex: Dinheiro, Boleto, etc
	@JsonView(util.Views.Public.class)
	private String formaPagamento;

	//Data de vencimento da movimentação
	@Temporal(TemporalType.DATE)
	@JsonView(util.Views.Public.class)
	private Date data;

	//Valor da movimentação
	@JsonView(util.Views.Public.class)
	private double valor;

	
	//Indicada se a movimentação foi ou não baixada(Paga)
	@JsonView(util.Views.Public.class)
	private boolean baixada;


    //Usado para gerar movimentações recorrente(Que se repetem em certo intervalo)
	//1 = diário
	//2 = semanal
	//3 = mensal
	//4 = trimestral
	//5 = semestral
	//6 = anual
	@JsonView(util.Views.Public.class)
	private int modoRepeticao;


	//1 = despesa, 2 = receita
	@JsonView(util.Views.Public.class)
	private int tipo;


	//Data de pagamento da movimentação
	@Temporal(TemporalType.DATE)
	@JsonView(util.Views.Public.class)
	private Date dataBaixa;


	//Pessoa para qual a movimentação se destina (Poder ser um fornecedor, cliente, funcionário, etc)
	@ManyToOne
	@JoinColumn(name="id_pessoa",nullable=true)
	@JsonView(util.Views.Public.class)
	private Pessoa pessoa;

	

	//Identificação da parcela em caso de item parcelado
	@JsonView(util.Views.Public.class)
	private int parcela;


	//Identificação ddo número de parcelas (No caso de movimentação parcelada)
	@JsonView(util.Views.Public.class)
	private int numeroParcelas;

    //Lista de pedidos na movimentação
	//Pedidos de entrada(tipoEntrada=1), em caso de movimentação relacionada a entrada de mercadoria
	//Pedidos de saída (tipoEntrada=0), em caso de movimentação relacionada a vendas
	@OneToMany(mappedBy = "movimentacao", targetEntity = Pedido.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JsonView(util.Views.Public.class)
	private List<Pedido> pedidos = new ArrayList<Pedido>();


	
	/*
	 Em caso de movimentação parceladas ou recorrente, indica qual é a movimentação original que gerou a movimentação em questão.
	 */
	@ManyToOne
	@JoinColumn(name="id_original_mov",nullable=true)
	@JsonView(util.Views.Public.class)
	private Movimentacao originalMov;



	public void setDataBaixa(String dataBaixa) {

		this.dataBaixa = DataUtil.formatData(dataBaixa);

	}



	public List<Pedido> getPedidos() {

		if(this.getOriginalMov()!=null && this.getOriginalMov().getPedidos()!=null)
			pedidos = this.getOriginalMov().getPedidos();

		return pedidos;
	}



	public void setData(String data) {

		this.data = DataUtil.formatData(data);


	}


	public double getValor() {

		if(this.getPedidos()!=null && this.getPedidos().size()>0 && this.getParcela()==0 && this.getTipoOperacaoLancamento()!=Movimentacao.TIPO_OPERACAO_ENTRADA_ESTOQUE){

			double total=0;

			System.out.println("-------------");
			for(Pedido p:getPedidos()){

				System.out.println(p.getProduto().getNome()+" "+p.getQuantidade()+" "+p.getTotal());

				total+=p.getTotal();
			}
			return total;

		}

		return valor;
	}



}
