import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import * as _ from 'lodash';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { Constant } from 'src/app/models/Constant';
import { ImageUpload } from 'src/app/models/ImageUpload';
import { DataService } from 'src/app/services/data.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-rpa-component',
  templateUrl: './rpa-component.component.html',
  styleUrls: ['./rpa-component.component.css']
})
export class RpaComponentComponent implements OnInit {


  readonly Constant = Constant;

  constructor(private dataService: DataService,
    private firebaseStorage: AngularFireStorage,
    private reportService: ReportService) { }

  ngOnInit(): void {

  }

  logId:string='';
  status:string='';

  saveRpaRespToggle:boolean= false;
  saveRpaResponse(){
    this.saveRpaRespToggle = true;
    this.reportService.saveRpaResponse(this.logId, this.status, this.snapShotUrl).subscribe(response=>{
      if(response){
        this.logId= '';
        this.status= '';
        this.resetUpload();
        this.dataService.showToast('Sucessfully updated', 'success');
      }
      this.saveRpaRespToggle = false;
    },error=>{
      this.saveRpaRespToggle = false;
    })
  }


  // --------------------------- firebase doc upload section --------------------------------------

  uploadedToggle: boolean = false;
  uploadingToggle: boolean = false;
  currentUpload: any;
  urls: any[] = new Array();
  files: any[] = new Array();
  selectedFiles: any[] = new Array();
  tempProgress: number = 0;
  progress: number = 0;
  fileName: string = "";
  fileExtension:string='';
  snapShotUrl:string='';
 
  currentCount: any;
  fileUrlErrorMessage:boolean = false;

  onDrop(event: any) {
    debugger
    this.uploadingToggle = true;
    this.urls = new Array();
    this.files = new Array();
    this.selectedFiles = event;
    this.files = event[0];
    this.urls = event[0];
    this.uploadMulti();
  }


  onSelectFile(event: any) {
    debugger
    this.uploadingToggle = true;
    this.urls = new Array();
    this.files = new Array();
    this.selectedFiles = event.target.files;
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const element = event.target.files[i];
        this.files.push(element.name);
        var reader = new FileReader();
        reader.onload = (event2: any) => {
          this.urls.push(event2.target.result);
          if (this.urls.length == event.target.files.length) {
            this.uploadMulti();
          }
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    } else {
      this.uploadingToggle = false
      this.uploadedToggle = false
    }
  }

  uploadMulti() {
    debugger
    let files = this.selectedFiles;
    let filesIndex = _.range(files.length);
    this.pushUpload(filesIndex, files);
    this.urls = new Array();
  }

  pushUpload(filesIndex: any, files: any) {
    debugger
    this.snapShotUrl = '';
    _.each(filesIndex, async (idx: any) => {
      this.currentCount++;
      this.currentUpload = new ImageUpload(files[idx]);
      this.fileExtension = this.currentUpload.file.type;

      let fileExt;
      if(this.fileExtension.includes("/")){
        fileExt = this.fileExtension.split("/")[1];
      } else {
        fileExt = this.fileExtension;
      }

      this.fileName = "RPA_snapshot/logid_" + this.logId + "_"+ moment(new Date()).format('MMMDD_YYYY_hh_mm_ss');
      const fileRef = this.firebaseStorage.ref(this.fileName);
      
      this.firebaseStorage.upload(this.fileName, this.currentUpload.file).snapshotChanges().pipe(
        finalize(async () => {
          fileRef.getDownloadURL().subscribe((url: any) => {
            this.snapShotUrl = url;
            this.fileUrlErrorMessage = false;

            this.uploadedToggle = true;
            this.uploadingToggle = false;
          });
        })
      ).subscribe((res: any) => {
        if (((res.bytesTransferred / res.totalBytes) * 100) == 100) {
          this.tempProgress = (res.bytesTransferred / res.totalBytes) * 100;;
          this.progress = this.tempProgress;
        }
        if (((res.bytesTransferred / res.totalBytes) * 100) < 100 && ((res.bytesTransferred / res.totalBytes) * 100) > this.progress) {
          this.progress = (res.bytesTransferred / res.totalBytes) * 100;
        }
        if (this.tempProgress == this.currentCount * 100) {
          this.progress = this.tempProgress;
        }
      })
    });
  }

  resetUpload() {
    this.uploadedToggle = false;
    this.fileName = '';
    this.snapShotUrl = '';
  }
  // --------------------------- firebase doc upload section --------------------------------------

}
