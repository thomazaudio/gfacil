package cliente;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import util.Pessoa;

@Entity
@DiscriminatorValue("cliente")
public class Cliente extends Pessoa {

	
	
}
