package teste;

import javax.persistence.Column;
import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonView;

import crud.CrudClass;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class TestDefinition extends CrudClass {
	
	@JsonView(util.Views.Public.class)
	private String titulo;

	@JsonView(util.Views.Public.class)
	@Column( length = 100000 )
	private String descricao;
	
	@JsonView(util.Views.Public.class)
	private String queryVerification;
	
	@JsonView(util.Views.Public.class)
	private double precoTeste;
	
	@JsonView(util.Views.Public.class)
	private int nivelDificuldade;
}
