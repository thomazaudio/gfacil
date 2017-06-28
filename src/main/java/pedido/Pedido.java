package pedido;
import java.util.Date;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import com.fasterxml.jackson.annotation.JsonView;
import crud.CrudClass;
import logisticareversa.LogisticaReversa;
import lombok.Getter;
import lombok.Setter;
import movimentacao.Movimentacao;
import produto.Produto;

@Entity
@Getter @Setter
public class Pedido extends CrudClass {


	public Pedido(){


	}

	public Pedido(long id){


		this.setId(id);

	}
	
	//Logistica reversa relacionada ao pedido
	@ManyToOne
	@JoinColumn(name="id_lr",nullable=true)
	@JsonView(util.Views.Public.class)
	private LogisticaReversa lr;

    //Movimentação relacionada ao Pedido
	@ManyToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="id_movimentacao",nullable=true)
	private Movimentacao movimentacao;

	@JsonView(util.Views.Public.class)
	private double valorUnitario;

	//Produto presente no pedido
	@ManyToOne
	@JoinColumn(name="id_produto",nullable=false)
	@JsonView(util.Views.Public.class)
	private Produto produto;

	//Quantidade do pedido
	@JsonView(util.Views.Public.class)
	private double quantidade;
	
	
    //Observações do Pedido 
	@JsonView(util.Views.Public.class)
	private String observacao;

	@Temporal(TemporalType.DATE)
	@JsonView(util.Views.Public.class)
	private Date date = new Date();

	//Total
	@Transient
	@JsonView(util.Views.Public.class)
	private double total;

    //1= indica que é um pedido de entrada, 0 (Padrão) indica que é um pedido de saída	
	@JsonView(util.Views.Public.class)
	private int tipoEntrada;
	
	//Descreve o tipo de operação que gerou o pedido, ex: Pedido de compra, correção de estoque, vendas, etc
	@JsonView(util.Views.Public.class)
	private String tipoOperacao;

	public double getTotal() {

		double precoPedido=0;
		precoPedido = this.getValorUnitario() * getQuantidade();
		return precoPedido;

	}

	@JsonView(util.Views.Public.class)
	private String nomePedido;

	//Se true, ao gerar uma venda, é lançado empréstimo de embalagens
	@JsonView(util.Views.Public.class)
	private boolean lancaEmprestimo;

}
