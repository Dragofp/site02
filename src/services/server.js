"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var express_1 = require("express");
var app = (0, express_1.default)();
var port = 3000;
var sequelize = new sequelize_1.Sequelize('b1', 'postgres', 'pass', {
    host: 'localhost',
    dialect: 'postgres'
});
var Curso = /** @class */ (function (_super) {
    __extends(Curso, _super);
    function Curso() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Curso;
}(sequelize_1.Model));
Curso.init({
    codigo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    descricao: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    ementa: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: sequelize,
    tableName: 'cursos'
});
app.listen(port, function () {
    console.log("Server is running at http://localhost:".concat(port));
});
