package crud;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.Setter;
import util.DataUtil;

@MappedSuperclass
@Getter @Setter
public  class CrudClass {
	
	
	//Filial correspondente
	@JsonView(util.Views.Public.class)
	@Column(name = "idFilial", columnDefinition = "bigint(20) default 1",nullable=false)
	private long idFilial;
	
	
	@JsonView(util.Views.Public.class)
	@Column(name = "idOperador", columnDefinition = "bigint(20) default 1",nullable=false)
    private long idOperador;
	
	//Objeto disponivel para todas as filiais
	@JsonView(util.Views.Public.class)
	@Column(name = "allFilials", columnDefinition = "int(11) default 0")
	private boolean allFilials;
	
	
	@JsonView(util.Views.Public.class)
	private int disable;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonView(util.Views.Public.class)
	private long id;
	
	//Armazena o historico de manipulacao do objeto
	@JsonView(util.Views.Public.class)
	@Column( length = 100000 )
	private String historicoObjeto;
	
	
	//Data de pagamento da movimentação
	@Temporal(TemporalType.DATE)
	@JsonView(util.Views.Public.class)
	private Date dataCadastro;


	public void setDataCadastro(String dataCadastro) {
		
		if(dataCadastro==null){
			this.dataCadastro = new Date();
		}
		else{
		this.dataCadastro = DataUtil.formatData(dataCadastro);
		}
	}

}
