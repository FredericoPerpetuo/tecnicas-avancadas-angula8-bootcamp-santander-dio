import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import { FilmesService } from 'src/app/core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';
import { ConfigParams } from 'src/app/shared/models/config-params';



@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {
  
  readonly semFoto = 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'
  config: ConfigParams = {
    pagina: 0,
    limite: 4
  };

  filmes: Filme[] = [];
  filtrosListagem: FormGroup;
  generos: Array<string>;

  constructor(private FilmesService: FilmesService,
              private fb: FormBuilder,
              private router: Router
              ) { }

  ngOnInit(): void {
    this.listarFilmes();
    this.filtrosListagem = this.fb.group({
      texto:[''],
      genero:['']
    })

    this.filtrosListagem.get('texto').valueChanges
      .pipe(debounceTime(400))
      .subscribe((val: string)=>{
      this.config.pesquisa = val;
      this.resetarConsulta();
    });

    this.filtrosListagem.get('genero').valueChanges.subscribe((val: string)=>{
      this.config.campo = {tipo:'genero', valor: val};
      this.resetarConsulta();
    });

    this.generos =  ["Ação", "Romance", "Aventura", "Terror", "Ficção Científica", "Comédia", "Drama"];
  }

  onScroll():void{
    this.listarFilmes();
  }

  abrir(id: number): void{
    this.router.navigateByUrl('/filmes/' + id);
  }

  private listarFilmes(): void{
    this.config.pagina++;
    this.FilmesService.listar(this.config)
    .subscribe((filmes: Filme[])=> this.filmes.push(...filmes));
  }

  private resetarConsulta(): void{
    this.config.pagina = 0;
    this.filmes = [];
    this.listarFilmes();
  }

}
