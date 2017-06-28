package fornecedor;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.Setter;
import util.Pessoa;


@Entity
@DiscriminatorValue("fornecedor")
@Getter @Setter
public class Fornecedor extends Pessoa {

   @JsonView(util.Views.Public.class)
   @Column(nullable=true,columnDefinition="int default 1")
   private int diasEntrega;

	

}
