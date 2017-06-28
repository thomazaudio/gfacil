package movimentacao;

import com.fasterxml.jackson.annotation.JsonView;


//Objeto auxiliar para deletar uma movimentação
//Uma movimentação parcelada pode ter varios tipos de exclusao

public class ObjectAltMov {
 
	@JsonView(util.Views.Public.class)
	private Movimentacao mov;
	
	@JsonView(util.Views.Public.class)
	private String modo;

	public Movimentacao getMov() {
		return mov;
	}
	public void setMov(Movimentacao mov) {
		this.mov = mov;
	}
	public String getModo() {
		return modo;
	}
	public void setModo(String modo) {
		this.modo = modo;
	}
}
