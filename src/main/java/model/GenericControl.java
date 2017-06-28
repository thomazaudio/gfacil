package model;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import util.AjaxResponse;

public abstract class GenericControl<E> {

	@Autowired
	private GenericService<E> service;

	public GenericService<E> getService() {
		return service;
	}
	public void setService(GenericService<E> service) {
		this.service = service;
	}

	//Abstra��es
	public abstract AjaxResponse<E> addOrUpdate(@RequestBody E item);
	public abstract AjaxResponse<E> getAll();
	public abstract AjaxResponse<E> getById(@RequestParam Long id);
	public abstract AjaxResponse<E> getLike(@RequestParam String propriedade, @RequestParam String query);
	public abstract AjaxResponse<E> delete(@RequestBody long[] ids);
	public abstract AjaxResponse<E> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra);

	//Adicionar/salvar mais de um item
	public AjaxResponse<E> addOrUpdateAllAndRespond(ArrayList<E> itens) {

		AjaxResponse<E> res = new AjaxResponse<E>();
		res.setItem(service.addOrUpdateAll(itens));
		return res;
	}
	
	//Respostas
	public AjaxResponse<E> addOrUpdateAndRespond(E item) {

		AjaxResponse<E> res = new AjaxResponse<E>();
		res.setItem(service.addOrUpdate(item));
		return res;
	}


	//Respostas
	public AjaxResponse<E> updateAndRespond(E item) {

		AjaxResponse<E> res = new AjaxResponse<E>();
		res.setItem(service.update(item));
		return res;
	}



	public AjaxResponse<E> getByIdAndRespond(long id) {

		AjaxResponse<E> res = new AjaxResponse<E>();
		res.setItem(service.getById(id));
		return res;
	}


	public AjaxResponse<E> getByAttrAndRespond(String attr, String valor) {

		AjaxResponse<E> res = new AjaxResponse<E>();
		res.setItem(service.getByAttr(attr, valor));
		return res;
	}

	public AjaxResponse<E> removeAndRespond(E item) {


		AjaxResponse<E> res = new AjaxResponse<E>();

		try{

			service.remove(item);
			res.setCod(AjaxResponse.COD_OK);

		}catch(Exception e){

			res.setCod(AjaxResponse.COD_ERRO);
		}


		return res;
	}



	public AjaxResponse<E> getAllAndRespond() {

		AjaxResponse<E> res = new  AjaxResponse<E>();

		res.setItens(service.getAll());

		return res;
	}

	public AjaxResponse<E> getLikeAndRespond(String propriedade,String query) {

		AjaxResponse<E> res = new  AjaxResponse<E>();

		res.setItens(service.getLike(propriedade, query));

		return res;
	}


	public AjaxResponse<E> getLikeMapAndRespond(String[] qs, int pagina, int max, String extra) {

		AjaxResponse<E> res = new  AjaxResponse<E>();

		//Seta a quantidade total de itens indepentemente da paginação
		res.setCountAll(service.getCountItens(qs, extra));
		
		//Seta os objetos
		res.setItens(service.getLikeMap(qs, pagina, max, extra));
 
		return res;
	}

	public AjaxResponse<E> deleteByIdAndRespond(long ids[]) {

		this.getService().deleteByIds(ids);

		return getAllAndRespond();

	}




}
