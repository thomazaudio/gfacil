package logisticareversa;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonView;
import crud.CrudClass;
import lombok.Getter;
import lombok.Setter;
import util.Pessoa;

@Entity
@Getter @Setter
public class LogisticaReversa  extends CrudClass{

	public static final int TIPO_ENTRADA=1;//Devolução
	public static final int TIPO_SAIDA=2;//Empréstimo
	
	@JsonView(util.Views.Public.class)
    private int tipo;
	
	@JsonView(util.Views.Public.class)
	private int quantidade;

	//Descrição do item (Ex Caixa Plástica)
	@JsonView(util.Views.Public.class)
	private String descricaoItem;
	
	@ManyToOne
	@JoinColumn(name="id_pessoa",nullable=true)
	@JsonView(util.Views.Public.class)
	private Pessoa pessoa;//Pessoa para qual a LR se destina
	
}