package nfe;


import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonView;

import crud.CrudClass;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class GrupoImposto extends CrudClass {


	//Nome do grupo de imposto
	@JsonView(util.Views.Public.class)
	private String nomeGrupo;
	
	
	@JsonView(util.Views.Public.class)
	private String icmsCST;

	@JsonView(util.Views.Public.class)
	private String icmsOrig;

	@JsonView(util.Views.Public.class)
	private String icmsModBC;

	@JsonView(util.Views.Public.class)
	private String imcsPICMS;

	@JsonView(util.Views.Public.class)
	private String imcsModBCST;

	@JsonView(util.Views.Public.class)
	private String imcsPMVAST;

	@JsonView(util.Views.Public.class)
	private String icmsPRedBCST;

	@JsonView(util.Views.Public.class)
	private String icmsPICMS;

	@JsonView(util.Views.Public.class)
	private String icmsPICMSST;

	@JsonView(util.Views.Public.class)
	private String icmsMotDesICMS;

	@JsonView(util.Views.Public.class)
	private String icmsPRedBC;

	@JsonView(util.Views.Public.class)
	private String icmsPBCOp;

	@JsonView(util.Views.Public.class)
	private String icmsUFST;

	@JsonView(util.Views.Public.class)
	private String icmsPCredSN;





}
