import {Component} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {HttpClient} from "@angular/common/http";
import * as moment from 'moment';

@Component({
  selector: 'app-vm',
  templateUrl: './vm.component.html',
  styleUrls: ['./vm.component.scss']
})
export class VmComponent {

  task = [];
  vm = [];

  public typeVm: number = 1;
  public typeTask: number = 1;

  public availableTypeTask: Array<any> = [
    {id: 1, name: 'Создание новой виртуальной машины'},
    {id: 2, name: 'Управление виртуальной машиной'}
  ];

  public typeOs: number = 1;

  public availableTypeOs: Array<any> = [
    {id: 1, name: 'win'}
  ];

  public typeCommand: number = 1;

  public availableTypeCommand: Array<any> = [
    {id: 1, name: 'Перезагрузить'},
    {id: 2, name: 'Выключить'},
    {id: 3, name: 'Вклочить'},
    {id: 4, name: 'Сбросить питание'}
  ];


  createTask() {
    let obj = {
      "idClient": this.authService.getIdClient(),
      "action": this.typeTask == 1 ? "CreateVM" : "ControlVM"
    };

    if (this.typeTask == 1) {
      // @ts-ignore
      obj["iso"] = "win";
    } else if (this.typeTask == 2) {
      // @ts-ignore
      let command: string;
      switch (this.typeCommand) {
        case 1:
          command = "reboot";
          break;
        case 2:
          command = "shutdown";
          break;
        case 3:
          command = "start";
          break;
        case 4:
          command = "reset";
          break;
      }
      // @ts-ignore
      obj["command"] = command;
      // @ts-ignore
      obj["name"] = "win_" + this.typeVm;
    }
    console.log(obj);
    this.authService.task(obj)
  }


  constructor(public authService: AuthService, private http: HttpClient) {
    authService.isLoginIfElseRedirect();
    this.woodyTask();
    this.woodyVM();
  }

  woodyTask() {
    if (this.authService.isLogin()) {
      let self = this;
      this.http.get("/TaskByIdClient/" + this.authService.getIdClient()).subscribe((response) => {
        //console.log(response);
        // @ts-ignore
        self.task = response;
        setTimeout(function () {
          self.woodyTask();
        }, 5000);
      });
    }

  }

  woodyVM() {
    if (this.authService.isLogin()) {
      let self = this;
      this.http.get("/VirtualServerByIdClient/" + this.authService.getIdClient()).subscribe((response) => {
        //console.log(response);
        // @ts-ignore
        self.vm = response;
        setTimeout(function () {
          self.woodyVM();
        }, 5000);
      });
    }
  }

  mapMasked = {};

  toggle(o: any) {
    // @ts-ignore
    var curStatus = this.mapMasked[o["id"]] != undefined && this.mapMasked[o["id"]] == true;
    // @ts-ignore
    this.mapMasked[o["id"]] = !this.mapMasked[o["id"]];
  }

  mask(o: any) {
    // @ts-ignore
    if (this.mapMasked[o["id"]] != undefined && this.mapMasked[o["id"]] == true) {
      return o["password"];
    } else {
      return "****************";
    }
  }

  aboutStatusVM(status: number) {

    switch (status) {
      case 0:
        return "Установка"
      case 1:
        return "Установка закончена";
      case 2:
        return "Выключена";
      case 3:
        return "Запущена"
    }

    return "Статус не известен";
  }

  aboutStatusTask(status: number) {

    switch (status) {
      case 0:
        return "Ожидание установки"
      case 1:
        return "Установка";
      case 2:
        return "Выполнена";
      case -1:
        return "Ошибка выполнения"
    }

    return "Статус не известен";
  }

  aboutTask(task: string, p: any) {
    let parsed = JSON.parse(task);
    let about = "";
    switch (parsed["action"]) {
      case "CreateVM":
        about += "Создание VM";
        break;
      case "ControlVM":
        about += "Управление VM: " + parsed["command"];
        break;
    }
    if (parsed["iso"] != undefined) {
      about += " Операционная система: " + parsed["iso"];
    }

    if (parsed["name"] != undefined) {
      about += " " + parsed["name"];
    } else if (p["linkIdVSrv"] != undefined && p["linkIdVSrv"] != "") {
      about += "_" + p["linkIdVSrv"];
    }

    return about + " " + p["retry"] + "/" + p["retryMax"];
  }

  calculateDiff(dataB: string) {
    return moment.utc().diff(moment(dataB), "minutes");
  }

}
