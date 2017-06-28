package model;
import java.util.ArrayList;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;


@Transactional
public abstract class GenericService<E> {
	
	
	
	
	@Autowired
	private GenericDAO<E> dao;
	
	public GenericDAO<E> getDao() {
		return dao;
	}
	public void setDao(GenericDAO<E> dao) {
		this.dao = dao;
	}
	
	
	@Transactional
	public int changeAttr(long id,String atributo,String queryValue){
		
		return dao.changeAttr(id, atributo,queryValue);
	}
	
	@Transactional
	public E merge(E item){
		
		return dao.merge(item);
	}
	
	
	
	
	@Transactional
	public E update(E item){
		
		return dao.update(item);
	}
	
	
	
	
	@Transactional
	public E addOrUpdate(E item) {
		
		
		dao.addOrUpdate(item);
		return item;
	}
	
	@Transactional
	public E addOrUpdateAll(ArrayList<E> itens) {
		
		
		return dao.addOrUpdateAll(itens);
		
	}
	
	
	@Transactional
	public void addsOrUpdate(ArrayList<E> itens) {
		
		for(E item :itens){
			
			dao.addOrUpdate(item);
		}
		
	}
	
	@Transactional(readOnly=true)
	public E getById(long id) {
		
		return  dao.getById(id);
		
	}
	
	@Transactional(readOnly=true)
	public ArrayList<E> getByIds(long[] ids) {
		
		return  dao.getByIds(ids);
		
	}
	
	
	@Transactional(readOnly=true)
	public E getByAttr(String attr, String valor) {
		
		return  dao.getByAttr(attr, valor);
		
	}
	
	@Transactional
	public void remove(E item) {
		
		dao.remove(item);
	}
	
	@Transactional(readOnly=true)
	public ArrayList<E> getAll() {
		
		return dao.getAll();
	}
	
	@Transactional(readOnly=true)
	public ArrayList<E> getLike(String propriedade,String query) {
		
		return dao.getLike(propriedade, query);
	}
	
	@Transactional(readOnly=true)
	public ArrayList<E> getLikeMap(String[] qs, int pagina, int max, String extra) {
		
		return dao.getLikeMap(qs, pagina, max,extra);
	}
	
	
	@Transactional
	public void deleteByIds(long[] ids) {
		
		
		dao.deleteByIds(ids);
		
	}
	
	@Transactional
	public Object executeFunction(String objeto,String function, String column,String extra){
		return dao.executeFunction(objeto,function, column, extra);
	}
	
	@Transactional
	public void deleteAll(){
		
		dao.deleteAll();
	}
	
	@Transactional
	public ArrayList<Map<String,Object>> getProjecoes (String[] qs,String extra,String columns, String groupBy){
	  
		 return dao.getProjecoes(qs, extra, columns, groupBy);
		   
	}
	
	@Transactional
	public Long getCountItens(String[] qs,String extra){

		return dao.getCountItens(qs, extra);
	
	}
	

}
