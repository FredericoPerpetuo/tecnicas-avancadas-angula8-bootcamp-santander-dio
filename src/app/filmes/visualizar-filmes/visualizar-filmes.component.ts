import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { Alerta } from 'src/app/shared/models/alerta';
import { Filme } from 'src/app/shared/models/filme';
import { FilmesService } from './../../core/filmes.service';


@Component({
  selector: 'dio-visualizar-filmes',
  templateUrl: './visualizar-filmes.component.html',
  styleUrls: ['./visualizar-filmes.component.scss']
})
export class VisualizarFilmesComponent implements OnInit {
  readonly semFoto = 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'
  filme: Filme;
  id: number;

  constructor(public dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private filmesService: FilmesService
    ) { }

  ngOnInit() {
    this.id=this.activatedRoute.snapshot.params['id']
    this.visualizar();
  }

  editar(): void{
    this.router.navigateByUrl('/filmes/cadastro/' + this.id);
  }

  excluir(): void{
    const config = {
      data:{
        titulo: 'Você tem certez que deseja excluir?',
        descricao: 'Se tem certeza que deseja excluir, clique no botão OK',
        corBtnCancelar: 'primary',
        corBtnSucesso:'warn',
        possuiBtnFechar: true
      } as Alerta
    };
     const dialogRef = this.dialog.open(AlertaComponent, config);
     dialogRef.afterClosed().subscribe((opcao: boolean) =>{
       if(opcao){
         this.filmesService.excluir(this.id)
         .subscribe(() => this.router.navigateByUrl('/filmes'));
       }
     }) 
  }

  private visualizar():void{
    this.filmesService.visualizar(this.id).subscribe((filme: Filme) => this.filme = filme);
  }

}
