package entradamercadoria;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonView;
import crud.CrudClass;
import lombok.Getter;
import lombok.Setter;
import movimentacao.Movimentacao;

@Entity
@Getter @Setter
public class EntradaMercadoria extends CrudClass {
	
	@ManyToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="id_movimentacao",nullable=true)
	@JsonView(util.Views.Public.class)
	private Movimentacao movimentacao;
	
}
