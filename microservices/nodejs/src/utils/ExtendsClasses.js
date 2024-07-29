import _ from "lodash";

export default function extendsProviderClasses(...classList) {
    class AggregatorClass {

        constructor() {
            this.accessTypes = [];
            classList.forEach((classItem, index) => {
                this.accessTypes= _.union(this.accessTypes, classItem.accessTypes);
                let propNames = Object.getOwnPropertyNames(classItem.prototype);

                propNames.forEach(name => {
                    if (name !== 'constructor') {
                        AggregatorClass.prototype[name] = classItem.prototype[name];
                    }
                });
            });

            classList.forEach(constructor => {
                Object.assign(AggregatorClass.prototype, new constructor())
            });
        }
    }
    return AggregatorClass;
}