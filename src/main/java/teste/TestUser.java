package teste;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonView;
import crud.CrudClass;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class TestUser extends CrudClass {


	//Produto presente no pedido
	@ManyToOne
	@JoinColumn(name="id_definition",nullable=false)
	@JsonView(util.Views.Public.class)
	//Armazena o historico de manipulacao do objeto
	private TestDefinition definition;

	@JsonView(util.Views.Public.class)
	@Column( length = 100000 )
	private String comentario;

	@JsonView(util.Views.Public.class)
	private int status;
	
	@JsonView(util.Views.Public.class)
	@Column(name = "pago", columnDefinition = "int default 0")
	private int pago;
	
	
	@JsonView(util.Views.Public.class)
	@Column(name = "erroSistema", columnDefinition = "int default 0")
	private int erroSistema;
	
	@JsonView(util.Views.Public.class)
	private String usuario;
	
	@JsonView(util.Views.Public.class)
	private Long tempoGasto;
	
	@JsonView(util.Views.Public.class)
	private double valorPago;
	
	@JsonView(util.Views.Public.class)
	private int nivelDificuldadeFromUser;
	
}
