package pdv;
import java.util.Calendar;
import java.util.Date;
import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import com.fasterxml.jackson.annotation.JsonView;
import logisticareversa.LogisticaReversa;
import lombok.Getter;
import lombok.Setter;
import movimentacao.Movimentacao;
import servicevenda.ServiceVenda;
import util.DataUtil;

@Entity
@DiscriminatorValue("pdv")
@Getter @Setter
public class Pdv extends ServiceVenda {
	
	@ManyToOne
	@JoinColumn(name="id_lr",nullable=true)
	@JsonView(util.Views.Public.class)
	private LogisticaReversa lr;//Logistica reversa relacionada ao pedido

	@JsonView(util.Views.Public.class)
	@Transient
	private Movimentacao[] parcelas;
	

	@Override
	@JsonView(util.Views.Public.class)
	public String getTipo() {
		
		return "pdv";
	}
	
	@JsonView(util.Views.Public.class)
	@Temporal(TemporalType.TIME)
	private Date hora = Calendar.getInstance().getTime();
	

	public void setHora(String h) {
		this.hora = DataUtil.formatData(h);
	}
	
	//Tipo de pdv em que uma venda foi lançada (pdv_ficha ou pdv_simples)
	@JsonView(util.Views.Public.class)
	private String tipoPdvLancamento;

	@JsonView(util.Views.Public.class)
	@Temporal(TemporalType.DATE)
	private Date data;

	public void setData(String data) {
		
		this.data =DataUtil.formatData(data);
	}
	
	@ManyToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="id_movimentacao",nullable=true)
	@JsonView(util.Views.Public.class)
	private Movimentacao movimentacao;
    
	@JsonView(util.Views.Public.class)
	private int carregado;
	
}
