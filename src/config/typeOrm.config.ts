import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Event } from "src/events/event.entity";
import { FileVersion } from "src/upload-pdf/upload-pdf.entity";

export const typeOrmConfig:TypeOrmModuleOptions={
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    username: 'root',
    password: 'Sourabh@1999',
    database: 'nest_udemy',
    autoLoadEntities: false,
    entities: [Event, FileVersion],
    synchronize: true,
    logging: true
}