package servicevenda;
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
import util.Pessoa;

@Entity
@Table(name="serviceVenda")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="tipo_service", discriminatorType=DiscriminatorType.STRING)
@Getter @Setter
public abstract class ServiceVenda extends CrudClass {

	public abstract String getTipo();
	
	@JsonView(util.Views.Public.class)
	private String observacoes;
	
	
	@ManyToOne
	@JoinColumn(name="id_vendedor",nullable=true)
	@JsonView(util.Views.Public.class)
	private Pessoa vendedor;

	
	
}
